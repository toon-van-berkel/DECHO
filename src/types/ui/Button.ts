export interface Button {
    text: string,
    destination: string,
    ariaLabel?: string,
}

export interface DialogButton extends Button{
    onClick: () => void,
}