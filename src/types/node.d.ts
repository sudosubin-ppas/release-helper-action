declare namespace NodeJS {
  export interface ProcessEnv {
    // custom env
    REPO_DIR: string;

    // github action default env
    GITHUB_TOKEN?: string;
    GITHUB_REPOSITORY?: string;
  }
}
