// 用户信息类型
export interface UserInfo {
  username: string;
  jobTitle: string;
  createdAt: string;
  updatedAt: string;
}

// GraphQL 响应类型
export interface Character {
  id: number;
  name: {
    full: string;
    native?: string;
    alternative?: string[];
  };
  image: {
    large: string;
    medium: string;
  };
  description?: string;
  gender?: string;
  age?: string;
  bloodType?: string;
  dateOfBirth?: {
    year?: number;
    month?: number;
    day?: number;
  };
  media: {
    nodes: Media[];
  };
  favourites?: number;
}

export interface Media {
  id: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  type: string;
  format?: string;
  status?: string;
  coverImage?: {
    large: string;
    medium: string;
  };
}

export interface CharactersResponse {
  Page: {
    pageInfo: {
      total: number;
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
      perPage: number;
    };
    characters: Character[];
  };
}

// 分页参数类型
export interface PaginationParams {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// GraphQL 查询变量类型
export interface GetCharactersVariables {
  page?: number;
  perPage?: number;
}

export interface GetCharacterVariables {
  id: number;
}

// 单个角色查询响应类型
export interface CharacterResponse {
  Character: Character;
}