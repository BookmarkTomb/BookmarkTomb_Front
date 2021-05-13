import {
    getCollections,
    updateCollectionInfo,
    deleteCollection,
    getDeletedCollections,
    restoreCollection,
    insertCollection,
    getCollectionByParent
} from "@/api/collection"
import {changJsonEle, generateTree} from "@/lib/utils/treeUtil";

const state = {
    userCollections: [],
    deletedCollections: [],
    newCollection: [],
    treeItems: [],
    collectionOfParent: []
}

const mutations = {
    SET_USER_COLLECTION: (state, collection) => {
        state.userCollections = collection
    },

    SET_COLLECTION_OF_PARENT: (state, collection) => {
        if(collection.length === 1) {
            state.collectionOfParent = changJsonEle(collection)
        }else {
            state.collectionOfParent = generateTree(collection)
        }
    },

    SET_DELETED_COLLECTION: (state, data) => {
        state.deletedCollections = data
        let url = ''

        function setCollection(parentId) {
            if (parentId === 0) {
                url = '/'.concat(url)
            } else {
                for (let i = 0; i < state.userCollections.length; i++) {
                    if (parentId === state.userCollections[i].id) {
                        url = state.userCollections[i].title.concat('/', url)
                        setCollection(state.userCollections[i].parentId)
                    }
                }
            }
        }

        for (let i = 0; i < state.deletedCollections.length; i++) {
            url = ''
            setCollection(state.deletedCollections[i].parentId)
            if (url === '') url = 'This collection do not have parent collection!'
            state.deletedCollections[i].url = url
        }
    },

    RESTORE_COLLECTION: (state, index) => {
        let traverseTree = []
        traverseTree.id = 0
        traverseTree.children = state.treeItems
        function traverseTreeOfInsert(node) {
            if (node) {
                if (node.id === state.collectionOfParent[0].parentId) {
                    node.children.push(state.collectionOfParent[0])
                }
                for (let children of node.children) {
                    traverseTreeOfInsert(children)
                }
            }
        }
        traverseTreeOfInsert(traverseTree)
        state.deletedCollections.splice(index, 1)
    },
    SET_NEW_COLLECTION: (state, data) => {
        state.newCollection = data
    },
    SET_TREE_ITEMS: (state, data) => {
        state.treeItems = data
    },
    UPDATE_COLLECTION: (state, data) => {
        let traverseTree = []
        for (let collection of state.userCollections) {
            if (collection.id === data.id) {
                collection.title = data.title
            }
        }
        traverseTree.children = state.treeItems

        function traverseTreeOfUpdate(node) {
            if (node) {
                if (node.id === data.id) {
                    node.name = data.title
                }
                for (let children of node.children) {
                    traverseTreeOfUpdate(children)
                }
            }
        }

        traverseTreeOfUpdate(traverseTree)
    },
    DELETE_COLLECTION: (state, collectionId) => {
        let traverseTree = []
        traverseTree.children = state.treeItems
        for (let i = 0; i < state.userCollections.length; i++) {
            if (state.userCollections[i].id === collectionId) {
                state.userCollections.splice(i, 1)
            }
        }

        function traverseTreeOfDelete(node) {
            if (node) {
                for (let i = 0; i < node.children.length; i++) {
                    if (node.children[i].id === collectionId) {
                        node.children.splice(i, 1)
                    }
                    if (node.children[i]) {
                        traverseTreeOfDelete(node.children[i])
                    }
                }
            }
        }

        traverseTreeOfDelete(traverseTree)
    },
    INSERT_COLLECTION: (state, data) => {
        let traverseTree = []
        traverseTree.children = state.treeItems
        let newCollection = JSON.parse(JSON.stringify(data.newCollection).replace(/title/g, "name"))
        newCollection.children = []
        if (data.id === 0) {
            state.treeItems.push(newCollection)
        }

        function traverseTreeOfInsert(node) {
            if (node) {
                if (node.id === data.id) {
                    node.children.push(newCollection)
                }
                for (let children of node.children) {
                    traverseTreeOfInsert(children)
                }
            }
        }

        traverseTreeOfInsert(traverseTree)
    }
}

const actions = {
    getCollections({commit}) {
        return new Promise((resolve, reject) => {
            getCollections().then(resp => {
                const {data} = resp
                commit('SET_USER_COLLECTION', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getCollectionByParent({commit}, parentId) {
        return new Promise((resolve, reject) => {
            getCollectionByParent(parentId).then(resp => {
                const {data} = resp
                commit('SET_COLLECTION_OF_PARENT', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    updateCollectionInfo(undefine, updateCollectionInfoParam) {
        return new Promise((resolve, reject) => {
            updateCollectionInfo(updateCollectionInfoParam).then(resp => {
                const {data} = resp
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    deleteCollection(undefine, colledtionId) {
        return new Promise((resolve, reject) => {
            deleteCollection(colledtionId).then(resp => {
                const {data} = resp
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getDeletedCollections({commit}) {
        return new Promise((resolve, reject) => {
            getDeletedCollections().then(resp => {
                const {data} = resp
                resolve(data)
                commit('SET_DELETED_COLLECTION', data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    restoreCollection(undefine , restoreCollectionParam) {
        return new Promise((resolve, reject) => {
            restoreCollection(restoreCollectionParam.collectionId).then(resp => {
                const {data} = resp
                // commit('RESTORE_COLLECTION', restoreCollectionParam.index)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    insertCollection({commit}, insertCollectionParam) {
        return new Promise((resolve, reject) => {
            insertCollection(insertCollectionParam).then(resp => {
                const {data} = resp
                let insertObj = {
                    newCollection: data,
                    id: insertCollectionParam.serverParentId
                }
                commit('INSERT_COLLECTION', insertObj)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespace: true,
    state,
    mutations,
    actions
}