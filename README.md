# zustand的学习

## 以下链接
- <https://github.com/pmndrs/zustand/>
- <https://juejin.cn/post/7056568996157456398>
- <https://juejin.cn/post/7178318352174022717>
- <https://github.com/facebook/react/blob/a1c62b8a7635c0bc51e477ba5437df9be5a9e64f/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js>
- <https://docs.pmnd.rs/zustand/integrations/persisting-store-data#hydration-and-asynchronous-storages>

## 基本功能的实现

- createStore
传入函数一个函数(set, get, api) => Store
内部定义函数setStore, getStore, api
store = initialState(setStore, getStore, api)
- useStore
通过use-sync-external-store插件去定义useStore
- use-sync-external-store的原理

```txt
useSyncExternalStoreWithSelector的原理是基于React的useMemo和useEffect hooks。它接收两个参数：selector和syncFunction。

selector是一个函数，它接收store的状态并返回必须同步的部分。syncFunction是一个函数，它接收必须同步的部分并返回任何需要更新存储的东西。

该hook首先使用useMemo将selector应用于存储的状态以获取必须同步的部分。然后使用useEffect，在必须同步的部分发生变化时调用syncFunction。syncFunction可能会更改存储的状态，例如调用某个API或将数据写入本地存储。

在此过程中，使用React的上下文和钩子来确保存储的状态被正确维护和同步。
```

- middleware的使用

很简单, 类似高阶函数的使用
