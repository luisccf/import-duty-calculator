type CurrencyProps = {
    value: number
}

export function Currency({value}:CurrencyProps) {
    return value.toLocaleString('pt-br', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })
}