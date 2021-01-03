import Koa from 'koa'

export interface IControllerCtx extends Koa<Koa.DefaultState, Koa.DefaultContext>  {
    render: (path: string) => void
    setState: (state: Record<string, any>) => void
    setHeader: (opts: Record<string, string>) => void
}
