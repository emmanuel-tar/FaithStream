
export enum Category {
  SERMON = 'Sermon',
  WORSHIP = 'Worship',
  BIBLE_STUDY = 'Bible Study',
  CONFERENCE = 'Conference',
  YOUTH = 'Youth'
}

export interface Media {
  id: string;
  title: string;
  preacher: string;
  category: Category;
  description?: string;
  datePreached: string;
  fileUrl: string;
  thumbnailUrl: string;
  duration: string;
  playCount: number;
  downloadCount: number;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
}

export interface AuthState {
  isAdmin: boolean;
  user: Admin | null;
}
