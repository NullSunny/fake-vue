import { renderData } from "./render.js"

const arrayProto = Array.prototype;
function defArrayFunc(obj, func, namespace, vm) {
    Object.defineProperty(obj, func, {
        enumerable: true,
        configurable: true,
        value: function (...args) {
            let original = arrayProto[func];
            const result = original.apply(this, args);
            renderData(vm, getNameSpace(namespace, prop))
            return result
        }
    })
}
function proxyArr(vm, arr, namespace) {
    let obj = {
        eleType: "Array",
        toString: function () {
            let result = "";
            for (let i = 0; i < arr.length; i++) {
                result += arr[i] + ", "
            }
            return result.substring(0, result.length - 2)
        },
        push() { },
        pop() { },
        shift() { },
        unshift() { }
    }
    defArrayFunc.call(vm, obj, "push", namespace, vm);
    defArrayFunc.call(vm, obj, "pop", namespace, vm);
    defArrayFunc.call(vm, obj, "shift", namespace, vm);
    defArrayFunc.call(vm, obj, "unshift", namespace, vm);
    arr.__proto__ = obj;
    return arr
}
function constructObjectProxy(vm, obj, namespace) {
    let proxyObj = {};
    for (let prop in obj) {
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set: function (value) {
                // console.log(getNameSpace(namespace,prop))
                obj[prop] = value;
                renderData(vm, getNameSpace(namespace, prop))
            }
        })
        if (!namespace) {
            Object.defineProperty(vm, prop, {
                configurable: true,
                get() {
                    return obj[prop];
                },
                set: function (value) {
                    obj[prop] = value;
                    renderData(vm, getNameSpace(namespace, prop))
                }
            })
        }

        if (obj[prop] instanceof Object) {
            proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop))
        }
    }
    return proxyObj;
}

/**
 * 捕获对象修改事件
 * 使用
 * @param {*} vm Due对象 
 * @param {*} obj 代理的对象
 * @param {*} namespace 命名空间，区分子属性和根属性
 */
export function constructProxy(vm, obj, namespace) {
    let proxyObj = null;
    if (obj instanceof Array) {
        proxyObj = new Array(obj.length)
        for (let i = 0; i < obj.length; i++) {
            proxyObj[i] = constructProxy(vm, obj[i], namespace)
        }
        proxyObj = proxyArr(vm, obj, namespace)
    } else if (obj instanceof Object) {
        proxyObj = constructObjectProxy(vm, obj, namespace);
    } else {
        throw new Error("error")
    }
    return proxyObj
}

function getNameSpace(nowNameSapce, nowProp) {
    if (nowNameSapce == null || nowNameSapce == "") {
        return nowProp
    } else if (nowProp == null || nowProp == "") {
        return nowNameSapce
    } else {
        return nowNameSapce + "." + nowProp
    }
}