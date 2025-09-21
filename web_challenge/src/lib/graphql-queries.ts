import { gql } from '@apollo/client';

// 查询动漫角色列表
export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      characters {
        id
        __typename
        name {
          full
          native
        }
        image {
          large
          medium
        }
        description
        gender
        age
        bloodType
        media {
          nodes {
            id
            __typename
            title {
              romaji
              english
            }
            type
          }
        }
      }
    }
  }
`;

// 查询单个角色详情
export const GET_CHARACTER = gql`
  query GetCharacter($id: Int!) {
    Character(id: $id) {
      id
      __typename
      name {
        full
        native
        alternative
      }
      image {
        large
        medium
      }
      description
      gender
      age
      bloodType
      dateOfBirth {
        year
        month
        day
      }
      media {
        nodes {
          id
          __typename
          title {
            romaji
            english
            native
          }
          type
          format
          status
          coverImage {
            large
            medium
          }
        }
      }
      favourites
    }
  }
`;