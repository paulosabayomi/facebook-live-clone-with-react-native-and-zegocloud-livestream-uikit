export interface IMainState {
    userDetail: TUserDetail;
}

export type TUserDetail = {
    name: string,
    id: string,
    liveId: string
}