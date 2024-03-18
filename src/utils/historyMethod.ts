class Dep {
    id: Date
    subs: Watch[]
    static watch: any

    // 订阅池
    constructor(name: string) {
        this.id = new Date() //这里简单的运用时间戳做订阅池的ID
        this.subs = [] //该事件下被订阅对象的集合
    }

    defined() {
        // 添加订阅者
        Dep.watch.add(this)
    }

    notify() {
        //通知订阅者有变化
        this.subs.forEach((e, i) => {
            if (typeof e.update === 'function') {
                try {
                    e.update.apply(e)
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }
}
Dep.watch = null

class Watch {
    name: string
    id: Date
    callBack: (name: string) => void

    constructor(name: string, fn: (name: string) => void) {
        this.name = name //订阅消息的名称
        this.id = new Date() //这里简单的运用时间戳做订阅者的ID
        this.callBack = fn //订阅消息发送改变时->订阅者执行的回调函数
    }

    add(dep: Dep) {
        //将订阅者放入dep订阅池
        dep.subs.push(this)
    }

    update() {
        //将订阅者更新方法
        var cb = this.callBack //赋值为了不改变函数内调用的this
        cb(this.name)
    }
}

const addHistoryMethod = (() => {
    const historyDep: Dep = new Dep('')
    return (name: string) => {
        if (name === 'historychange') {
            return (name: string, fn: () => void) => {
                const event: Watch = new Watch(name, fn)
                Dep.watch = event
                historyDep.defined()
                Dep.watch = null //置空供下一个订阅者使用
            }
        } else if (name === 'pushState' || name === 'replaceState') {
            const method: Function = history[name]
            return (...args: any[]) => {
                method.apply(history, args)
                historyDep.notify()
            }
        }
    }
})()

if (typeof window !== 'undefined') {
    window.addHistoryListener = addHistoryMethod('historychange')
    history.pushState = addHistoryMethod('pushState')
    // history.replaceState = addHistoryMethod('replaceState');
}
