declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.css'
declare module '*.less'
declare module '*.sass'
declare module '*.scss'
declare module '*.styl'

/**
 * 全局状态
 */
interface IStore {
  loading: {
    effects: string[]
  }
  media: IMediaStore
  placeType: IPlaceTypeStore
  channel: IChannelStore
  rebase: IRebaseStore
  rebaseGroup: IRebaseGroupStore
  template: ITemplateStore
  material: IMaterialStore
}

interface IMediaStore {
  data: {
    list: IMediaModel[]
    pagination: IPagination
    current: IMediaModel
  }
}

interface IPlaceTypeStore {
  data: {
    list: IPlaceTypeModel[]
    pagination: IPagination
    current: IPlaceTypeModel
  }
}

interface IChannelStore {
  data: {
    list: IChannelModel[]
    pagination: IPagination
    current: IChannelModel
  }
}

interface IRebaseStore {
  data: {
    list: IRebaseModel[]
    pagination: IPagination
    current: IRebaseModel
  }
}

interface IRebaseGroupStore {
  data: {
    list: IRebaseGroupModel[]
    pagination: IPagination
    current: IRebaseGroupModel
  }
}

interface ITemplateStore {
  data: {
    list: ITemplateModel[]
    pagination: IPagination
    current: ITemplateModel
  }
}

interface IMaterialStore {
  data: {
    list: IMaterialModel[]
    pagination: IPagination
    current: IMaterialModel
  }
}

interface IMediaModel {
  createTime: string
  creator: string
  creatorName: string
  groupId: string
  id: number
  name: string
  remark: string | null
  updateTime: string
  updater: string
  updaterName: string
}

interface IPlaceTypeModel {
  code: PlaceTypeCode
  createTime: string
  creator: string
  creatorName: string
  id: number
  name: string
  remark: string | null
  updateTime: string
  updater: string
  updaterName: string
}

interface IChannelModel {
  createTime: string
  creator: string
  creatorName: string
  mediaId: number
  id: number
  name: string
  remark: string | null
  updateTime: string
  updater: string
  updaterName: string
}

interface IRebaseModel {
  createTime: string
  creator: string
  creatorName: string
  fromAd?: null | string
  isFromAd?: null | boolean
  linkType?: null | string
  linkUrl: string
  materialId: number
  materialName: string
  materialUrl: string
  groupId: number
  id: number
  name: string
  remark: string | null
  updateTime: string
  updater: string
  updaterName: string
  selected?: number
}

interface IRebaseGroupModel {
  createTime: string
  creator: string
  creatorName: string
  id: number
  name: string
  remark: string | null
  updateTime: string
  updater: string
  updaterName: string
}

interface ITemplateModel {
  content: string | null
  createTime: string
  creator: string
  creatorName: string
  id: number
  name: string
  placeTypeCode: PlaceTypeCode
  placeTypeId: number
  placeTypeName: string
  remark: string | null
  updateTime: string
  updater: string
  updaterName: string
}

interface IMaterialModel {
  advId: number
  companyName: string
  createTime: string
  creator: string
  creatorName: string
  fileType: string
  height: number
  width: number
  url: string
  id: number
  len: number
  mimetype: string | null
  name: string
  ratio: string | null
  remark: string
  size: number | null
  type: number
  updateTime: string
  updater: string
  updaterName: string
}

type PlaceTypeCode = 'CAROUSEL' | 'NORMAL' | 'GRID'

interface IPagination {
  current: number
  pageSize: number
}

/**
 * dva异步方法调用
 */
type IDispatch = (object: { type: string; payload?: object; callback?: (res: any) => void }) => any
