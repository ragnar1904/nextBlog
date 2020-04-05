import gql from 'graphql-tag';

export const GET_POSTS = gql`
  query GetPosts($after: String, $category: Float) {
    allPosts(category: $category, first: 10, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      totalCount
      edges {
        node {
          id
          title
          rawId
          category {
            id
            name
          }
          tags {
            name
          }
          createdAt
          createdBy {
            name
          }
          updatedAt
        }
      }
    }
  }
`;
