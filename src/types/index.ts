export interface CommitOptions {
  version: string;
  targetBranch: string;
}

export interface ReleaseOptions {
  version: string;
  currentBranch: string;
}

export interface TargetBranchOptions {
  targetBranch: string;
}
