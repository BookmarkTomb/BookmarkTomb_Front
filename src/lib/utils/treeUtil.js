export function generateTree(userCollections) { //JSON数据生成树 从parentId为0开始
    let treeArr = changJsonEle(userCollections)
    let treeItems = []
    let rootCollection = {}
    let currentTreeViewArrays = [] //节点数组
    rootCollection.children = treeArr
        .filter(collection => collection.parentId === 0)
    if(rootCollection.children.length === 0) {      //判断是否从根节点开始遍历
        treeItems.push(treeArr[treeArr.length-1])
        rootCollection.children.push(treeArr[treeArr.length-1])
    }else {
        for(let collection of rootCollection.children) {
            treeItems.push(collection)
        }
    }
    currentTreeViewArrays.push(rootCollection.children)
    for(let currentTreeArr of currentTreeViewArrays) {  //遍历树节点
        for(let currentTree of currentTreeArr) {
            currentTree.children = treeArr
                .filter(collection => collection.parentId === currentTree.id)
            if(currentTree.children.length !== 0) {
                currentTreeViewArrays.push(currentTree.children) //将非空节点添加到待遍历数组
            }
        }
    }
    return treeItems
}

export function changJsonEle(data) {
    let treeArr = []
    for(let i=0; i<data.length; i++) {  //更改json数据属性名称
        data[i].children = []
        let a = JSON.parse(JSON.stringify(data[i]).replace("title","name"))
        treeArr.unshift(a)
    }
    return treeArr
}