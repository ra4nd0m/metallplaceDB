export function getPercentChangesArr(prices: number[], fixed: number): string[] {
    let changes: string[] = []
    let changeStr: string
    let change: number
    for (let i = 1; i < prices.length; i++) {
        changeStr = (prices[i] - prices[i - 1]).toFixed(fixed)
        change = prices[i] - prices[i - 1]
        if (change > 0) changes.push(`+${changeStr.replace(".", ",")}`)
        if (change < 0) changes.push(`${changeStr.replace(".", ",")}`)
        if (change === 0) changes.push(`-`)
    }
    changes.unshift("-")
    return changes
}
