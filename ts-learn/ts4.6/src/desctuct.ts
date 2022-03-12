type Action =
    | { kind: "NumberContents", payload: number }
    | { kind: "StringContents", payload: string };

function processAction(action: Action) {
    // 增加了解构后的类型判断
    const { kind, payload } = action
    if (kind === "NumberContents") {
        // `action.payload` is a number here.
        let num = payload * 2
        // ...
    }
    else if (kind === "StringContents") {
        // `action.payload` is a string here.
        const str = payload.slice(0, 1)
        // ...
    }
}
