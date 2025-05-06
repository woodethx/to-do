function createPubSub() {
    const events = {};
    const subscribe = (evt, fn) => {
        if(!events[evt]){
            events[evt] = new Set();
        }
        events[evt].add(fn);
    }
    const publish = (evt, data) => {
        const listeners = events[evt];
        if(!listeners){
            return console.log("No listeners");
        }
        listeners.forEach(fn => {
            try {fn(data);}
            catch (err) {console.error(err);}
        });
        console.log("PUBLISH: event: "+evt+", data: "+data);
    }
    const unsubscribe = (evt, fn) => {
        const listeners = events[evt];
        if (listeners) events[evt].delete(fn);
        if (listeners.size === 0) delete events[evt];
    }
    return{
        subscribe,
        publish,
        unsubscribe
    }
}

const bus = createPubSub();
export default bus;