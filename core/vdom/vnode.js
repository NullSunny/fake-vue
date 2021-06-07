export default class VNode{
    constructor(
        tag,//标签类型,DIV,SPAN,INPUT,#TEXT...
        elm,//对应的真是节点
        children,//当前节点的子节点
        text,//当前虚拟节点中的文本
        data,//
        parent,//当前节点的父级节点
        nodeType//节点的类型
    ){
        this.tag = tag;
        this.elm = elm;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.env = {};//当前节点的环境变量
        this.instruction = null;//存放指令
        this.template = [];//当前节点涉及到的模板
    }
}