/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createVideoCard = /* GraphQL */ `
  mutation CreateVideoCard(
    $input: CreateVideoCardInput!
    $condition: ModelVideoCardConditionInput
  ) {
    createVideoCard(input: $input, condition: $condition) {
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
export const updateVideoCard = /* GraphQL */ `
  mutation UpdateVideoCard(
    $input: UpdateVideoCardInput!
    $condition: ModelVideoCardConditionInput
  ) {
    updateVideoCard(input: $input, condition: $condition) {
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
export const deleteVideoCard = /* GraphQL */ `
  mutation DeleteVideoCard(
    $input: DeleteVideoCardInput!
    $condition: ModelVideoCardConditionInput
  ) {
    deleteVideoCard(input: $input, condition: $condition) {
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
export const createVideoCardRank = /* GraphQL */ `
  mutation CreateVideoCardRank(
    $input: CreateVideoCardRankInput!
    $condition: ModelVideoCardRankConditionInput
  ) {
    createVideoCardRank(input: $input, condition: $condition) {
      id
      name
      rank
      createdAt
      updatedAt
    }
  }
`;
export const updateVideoCardRank = /* GraphQL */ `
  mutation UpdateVideoCardRank(
    $input: UpdateVideoCardRankInput!
    $condition: ModelVideoCardRankConditionInput
  ) {
    updateVideoCardRank(input: $input, condition: $condition) {
      id
      name
      rank
      createdAt
      updatedAt
    }
  }
`;
export const deleteVideoCardRank = /* GraphQL */ `
  mutation DeleteVideoCardRank(
    $input: DeleteVideoCardRankInput!
    $condition: ModelVideoCardRankConditionInput
  ) {
    deleteVideoCardRank(input: $input, condition: $condition) {
      id
      name
      rank
      createdAt
      updatedAt
    }
  }
`;
