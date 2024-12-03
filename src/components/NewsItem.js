import React, { Component } from 'react'

export default class NewsItem extends Component {
  render() {
    let { title, description, imageUrl, newsUrl, publishedAt, author, source } = this.props;
    return (
      <div className='my-3'>
        
        <div className="card">
        <div style={{ display: 'flex' , justifyContent: 'felx-end',position:'absolute', right:'0' }}>
          <span className="badge rounded-pill bg-danger" >
            {source}
          </span>
        </div>
          <img src={imageUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description.slice(0, 80)}.....</p>
            <p className='card-text'><small className='text-muted'>By {author} on {new Date(publishedAt).toUTCString()}</small></p>
            <a rel="noreferrer" href={newsUrl} target='_blank' className="btn btn-dark">Read more</a>
          </div>
        </div>
      </div>
    )
  }
}
