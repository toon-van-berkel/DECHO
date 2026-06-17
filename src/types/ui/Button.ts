import * as ex from 'excalibur';

export interface Button {
    text: string,
    ariaLabel?: string
    destination: string,
}

export interface DialogButton extends Button{
    onClick: void,
}