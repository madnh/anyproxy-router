# AnyProxy Router

Use multi callback for one event.

Before:

```js
{
    * beforeSendRequest(requestDetail) {
        if(is-domain-a)
            return {....}
        
        if(is-domain-b)
            return {....}
        
        
        if(is-domain-c)
            return {....}
        
        return null
    },

    * beforeSendResponse(requestDetail) {
        .....
    },
}
```

Now:

```js
{
    "{hostname: \"domain-a.com\"}" : {
        beforeSendRequest: [ActionA, ActionB],
        
        beforeSendResponse: [ActionC, ActionD],
    },

    
    "{hostname: \"domain-b.com\"}" : {
        beforeSendRequest: [ActionE, ActionF],
        
        beforeSendResponse: [ActionG, ActionH],
    },

    ....
}
```

See [`example`](./examples) for demo.