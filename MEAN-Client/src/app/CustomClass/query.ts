export class Query {
    constructor(
        public _id: object,
        public projectname: string = '',
        public query: string = '',
        public replies: object[],
        public project: object,
        public userId: { Username: string },
        public createdAt: Date
    ) { }
}
