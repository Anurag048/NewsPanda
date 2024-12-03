import React, { Component } from 'react';
import NewsItem from './NewsItem';
import SPinner from './SPinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  static defaultProps = {
    pageSize: 8,
    category: 'general',
  
  };

  static propTypes = {
    pageSize: PropTypes.number,
    category: PropTypes.string
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)}-NewsPanda`;
  }

  async componentDidMount() {
    this.fetchNews();
  }

  fetchNews = async () => {
    try {
      this.props.setProgress(10);
      let url = `https://newsapi.org/v2/top-headlines?&sortBy=date&category=${this.props.category}&apiKey=${this.props.apiKey}=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({ loading: true });
      let data = await fetch(url);
      let parsedData = await data.json();
      const filteredArticles = parsedData.articles ? parsedData.articles.filter(article => article.title && article.description && article.urlToImage && article.url) : [];

      this.setState({
        articles: filteredArticles,
        loading: false,
        totalResults: parsedData.totalResults || 0
      });
      this.props.setProgress(100);

    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }
  };

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const url = `https://newsapi.org/v2/top-headlines?&sortBy=date&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      const filteredArticles = parsedData.articles ? parsedData.articles.filter(article => article.title && article.description && article.urlToImage && article.url) : [];
      this.setState({
        articles: this.state.articles.concat(filteredArticles),
        loading: false,
        totalResults: parsedData.totalResults || 0
      });
    } catch (error) {
      console.error("Error fetching more news:", error);
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">News-Panda Top Headlines</h1>
        {this.state.loading && <SPinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<SPinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element) => {
                return (
                  <div className="col-md-4" key={`${element.publishedAt}-${element.title}`}>
                    <NewsItem
                      title={element.title}
                      description={element.description}
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      publishedAt={element.publishedAt}
                      author={element.author}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}
