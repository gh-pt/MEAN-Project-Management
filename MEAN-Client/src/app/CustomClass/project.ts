export class Project {
    constructor(
        public _id: object,
        public ProjectName: string = '',
        public Details: string = '',
        public DemoLink: string = '',
        public GithubRepository: string = '',
        public Owner: { Username: string },
        public queries: object[]
    ) { }
}
