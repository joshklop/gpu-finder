/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const fetchedVideoCards = /* GraphQL */ `
  query FetchedVideoCards {
    fetchedVideoCards {
      id
      name
      url
      rank
      price
      createdAt
      updatedAt
    }
  }
`;
export const getVideoCard = /* GraphQL */ `
  query GetVideoCard($id: ID!) {
    getVideoCard(id: $id) {
      id
      name
      url
      rank
      price
      createdAt
      updatedAt
    }
  }
`;
export const listVideoCards = /* GraphQL */ `
  query ListVideoCards(
    $filter: ModelVideoCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVideoCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        url
        rank
        price
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getVideoCardRank = /* GraphQL */ `
  query GetVideoCardRank($id: ID!) {
    getVideoCardRank(id: $id) {
      id
      name
      rank
      createdAt
      updatedAt
    }
  }
`;
export const listVideoCardRanks = /* GraphQL */ `
  query ListVideoCardRanks(
    $filter: ModelVideoCardRankFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVideoCardRanks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        rank
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
