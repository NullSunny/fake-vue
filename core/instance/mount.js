import VNode from "../vdom/vnode.js";
import { prepareRender } from "./render.js";

export function initMount(Due) {
    Due.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom)
    }
}

export function mount(vm, elm) {
    // 进行挂载
    vm._vnode = constructorVNode(vm, elm, null);
    //进行预备挂载(建立渲染索引，通过模板找vnode，通过vnode找模板)
    prepareRender(vm,vm._vnode)
}

function constructorVNode(vm, elm, parent) {
    let vnode = null;
    let children = [];
    let text = getNodeText(elm);
    let data = null;
    let nodeType = elm.nodeType;
    let tag = elm.nodeName;
    vnode = new VNode(tag, elm, children, text, data, parent, nodeType);

    let childs = vnode.elm.childNodes;
    for (let i = 0; i < childs.length; i++) {
        let childNodes = constructorVNode(vm, childs[i], vnode);
        if (childNodes instanceof VNode) { //返回单一节点的时候
            vnode.children.push(childNodes)
        } else { //返回节点数组
            vnode.children = vnode.children.concat(childNodes);
        }

    }
    return vnode
}

function getNodeText(elm) {
    if (elm.nodeType == 3) {
        return elm.nodeValue;
    } else {
        return ""
    }
}