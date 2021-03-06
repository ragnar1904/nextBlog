import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';

import { useQuery } from '@apollo/react-hooks';

import { Fetching } from '../../components/common/Fetching';
import { Footer } from '../../components/common/Footer';
import { ReadMoreArea, ReadMoreButton } from '../../components/Post/ReadMore';
import { Breadcrumb } from '../../containers/Breadcrumb';
import { PostList } from '../../containers/PostList';
import { GET_POSTS } from '../../query/queries/getPosts';
import { GetPosts } from '../../types/api';

export const PostListPage: NextPage = () => {
  const { loading, error, data, fetchMore } = useQuery<GetPosts>(GET_POSTS);
  if (loading) return <Fetching />;
  if (error) return <div>{`Error! ${error.message}`}</div>;
  const paths = [
    { href: "/", label: "Home" },
    { href: "/post", label: "Posts" },
  ];

  return (
    <>
      <Head>
        <title key="title">記事一覧 - Ragnar Blog</title>
      </Head>
      <Title>記事一覧</Title>

      <Root>
        <div className="content">
          <Breadcrumb paths={paths} />
          {data && data.allPosts && data.allPosts.edges ? <PostList edges={data.allPosts.edges} /> : null}
          <ReadMoreArea>
            {data.allPosts.pageInfo.hasNextPage ? (
              <>
                <ReadMoreButton
                  onClick={() => {
                    fetchMore({
                      variables: {
                        after: data.allPosts.pageInfo.endCursor,
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newPageInfo = fetchMoreResult.allPosts.pageInfo;
                        const newEdges = fetchMoreResult.allPosts.edges;
                        return newEdges.length
                          ? {
                              allPosts: {
                                totalCount: previousResult.allPosts.totalCount,
                                __typename: previousResult.allPosts.__typename,
                                edges: [...previousResult.allPosts.edges, ...newEdges],
                                pageInfo: newPageInfo,
                              },
                            }
                          : previousResult;
                      },
                    });
                  }}>
                  Fetch More
                </ReadMoreButton>
                <p style={{ fontSize: "1.6rem", marginTop: "0.5em" }}>
                  {data.allPosts.edges.length}/{data.allPosts.totalCount}
                </p>
              </>
            ) : (
              <span style={{ fontSize: "1.6rem", marginTop: "0.5em" }}>
                {data.allPosts.edges.length}/{data.allPosts.totalCount}
              </span>
            )}
          </ReadMoreArea>
        </div>
      </Root>
      <Footer />
    </>
  );
};

const Title = styled.div`
  text-align: center;
  font-size: 2rem;
  margin: 2em;
`;

const Root = styled.div`
  display: grid;
  grid-template-columns: 5vw calc(100vw - 10vw) 5vw;
  /* desktop */
  @media screen and (min-width: 800px) {
    grid-template-columns: 1fr 800px 1fr;
  }
  > div.content {
    grid-column: 2/3;
  }
`;

export default PostListPage;
