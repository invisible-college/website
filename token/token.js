global.pointerify = true
var master = require('statebus').serve({
    port: 3336,
    client: (c) => {
        c('tokens').to_fetch = () => c.clone(master.fetch('tokens'))
        c('tokens').to_save = (o, t) => {
            var cu = c.fetch('current_user')
            if (!cu.logged_in) { t.abort(); return }
            var t = master.fetch('tokens')
            t._ = c.clone(o._)

            colors = '#ED5653 #F7931A #F3CA3E #1AAF5D #239BDE'.split(' ')
            for (var i=0; i<t._.length; i++)
                t._[i].color = colors[i % colors.length]

            master.save(t)
        }

        c('new_bid').to_save = (o, t) => {
            var old = c.fetch('new_bid')

            if (!c.fetch('current_user').logged_in) {
                console.log('yer not logged in', c.fetch('current_user'))
                t.abort()
                return
            }

            // Save the bid
            var bids = master.fetch('bids')
            key = 'bid/' + Math.random().toString(36).substring(7,13)
            bid = {
                key: key,
                tokens: o.tokens,
                dollars: o.dollars,
                status: 'open',
                user_key: c.fetch('current_user').user.key
            }
            console.log('master saving bid')
            master.save(bid)
            bids[key] = bid
            master.save(bids)

            // Clear this state
            t.abort()
        }

        c('bid/*').to_delete = (key, o, t) => {
            var cu = c.fetch('current_user')
            if (!cu.logged_in
                || cu.user.key !== o.user_key) {
                console.log('yer not logged in', c.fetch('current_user'))
                t.abort()
                return
            }
            
            t.done()

            delete master.state.bids[key]
        }
        c('bid/*').to_fetch = (k) => c.clone(master.fetch(k))
        c('bid/*').to_save = (o) => {
            var cu = fetch('/current_user') 
            if (!cu.logged_in || cu.user.key !== o.user_key
                || !validate(o, {key: 'string', tokens: 'number',
                                 dollars: 'number', user_key: 'string'})) {
                t.abort()
                return
            }

            var b = master.fetch(o.key)
            b.tokens = o.tokens
            b.dollars = o.dollars
            save(b)
        }
        c('bids').to_fetch = () => c.clone(master.fetch('bids'))
        c('buys').to_fetch = () => c.clone(master.fetch('buys'))
        c('sells').to_fetch = () => c.clone(master.fetch('sells'))
        c('fills').to_fetch = () => c.clone(master.fetch('fills'))
        c('fills').to_delete = () => {
            if (c.state.current_user.logged_in
                && c.state.current_user.user.email == 'toomim@gmail.com')
                master.state.fills = []
        }

        c('instant/*').to_fetch = (k, rest) => {
            if (rest.length === 0) return {}
            if (isNaN(parseFloat(rest)))
                return {error: 'bad amount'}
            var trades = instant(parseFloat(rest))
            if (!trades)
                return {error: 'Too much to handle'}
            var dollars = trades.reduce(((a,b) => a + b.dollars), 0)
            return {all:trades, dollars: dollars}
        }
        function small (n) { return Math.abs(n) < .0000001 }
        c('new_order').to_save = (o, t) => {
            cu = c.state.current_user
            console.log('New order!', o, cu().user.key)
            if (!cu.logged_in
                || !c.validate(o, {tokens: 'number', user_key: 'string', key: 'string'})) {
                t.abort()
                return
            }
            
            c.fetch('new_order')
            var trades = instant(o.tokens, cu().user.key)
            if (!trades) {t.abort(); return}
            for (var i=0; i<trades.length; i++) {
                var bid = master.fetch(trades[i].bid_key)
                var taker_acct = acct_by_name(cu.user.name)()
                var maker_acct = acct_by_name(master.state[bid.user_key].name)()

                console.log('Maker:', maker_acct.amount, 'Taker:', taker_acct.amount)
                if (maker_acct && taker_acct) {
                    taker_acct.amount += trades[i].tokens
                    maker_acct.amount -= trades[i].tokens
                    master.save(master.fetch('tokens'))
                }
                console.log('Now maker:', maker_acct.amount, 'Taker:', taker_acct.amount)
                bid.tokens += trades[i].tokens
                bid.dollars += trades[i].dollars
                console.assert(small(bid.tokens) === small(bid.dollars))
                log_fill(trades[i])
                if (small(bid.tokens))
                    master.delete(bid.key)
                else
                    master.save(bid)
            }
            // delete o.tokens
            // delete o.user_key
            // t.done(o)
            t.abort()
        }
    }
})
master.honk = 3

function price (bid) { return Math.abs(bid.dollars / bid.tokens) }
master('buys').to_fetch = () => {
    var result = []
    var bids = master.fetch('bids')
    for (var k in bids)
        if (k.match(/bid\/.*/) && bids[k].tokens > 0)
            result.push(bids[k])

    return {_:result.sort((a,b) => price(b) - price(a))}
}

master('sells').to_fetch = () => {
    var result = []
    var bids = master.fetch('bids')
    for (var k in bids)
        if (k.match(/bid\/.*/) && bids[k].tokens < 0)
            result.push(bids[k])
    return {_:result.sort((a,b) => price(b) - price(a))}
}

master('bid/*').to_delete = (k) => {
    delete master.state.bids[k]
    // master.dirty('bids')
}
function instant (tokens, user_key) {
    console.log('Instant/', tokens, 'by', user_key)
    var buying = tokens > 0
    var result = []
    var orders = master.fetch(buying ? 'sells' : 'buys')._ || []
    if (buying)
        orders = orders.slice().reverse()

    for (var i=0; i<orders.length; i++) {
        var order = orders[i]
        if (Math.abs(order.tokens) >= Math.abs(tokens)) {
            console.log('Eating into', order, 'with', tokens, 'tokens')
            var sale = {
                bid_key: order.key,
                tokens: tokens,
                dollars: (tokens/order.tokens) * order.dollars,
                maker_key: order.user_key,
                taker_key: user_key,
                when: new Date().getTime()/1000
            }
            result.push(sale)
            tokens -= sale.tokens
            console.log('..made', sale)
            break
        }
        else {
            console.log('Eating all of', order, 'with', tokens, 'tokens')
            var sale = {
                bid_key: order.key,
                tokens: -order.tokens,
                dollars: -order.dollars,
                maker_key: order.user_key,
                taker_key: user_key,
                when: new Date().getTime()/1000
            }
            result.push(sale)
            tokens -= sale.tokens
            console.log('..made', sale)
        }
    }
    if (tokens) {
        console.log('ending with', tokens)
        return null
    }
    return result
}

function user_by_name (name) {
    return master.state['users'].find((x) => x.name === name)
}
function acct_by_name (name) {
    return master.state.tokens.find((x) => x.name === name)
}
function log_fill(trade, user_key) {
    var fills = master.fetch('fills')
    fills._ = fills._ || []
    fills._.push(trade)
    master.save(fills)
    
    // if (!master.state.fills)
    //     master.state.fills = []
    
    // master.state.fills.push(trade)
}