import { Component, OnInit } from '@angular/core';
import { TopicService } from 'src/services/topic.service';
import { Topics } from 'src/types/topic';

@Component({
  selector: 'topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {
  topics: Topics[] = []
  currPage: number = 1
  startNumber: number = 1
  
  constructor(private topicService: TopicService) { }

  ngOnInit(): void {
    this.getTopics()
  }

  async getTopics(page = 1) {
    this.topicService.getTopics(page)
    .then((response) => {
      this.topics = response
      this.currPage = page
      this.startNumber = ((page - 1) * 5) + 1
    })
  }

  async movePage(action: string) {
    const minPage = 1
    const lastPage = 4

    switch(action) {
      case '<<':
        this.getTopics(minPage)
        break
      case '<':
        const prevPage = this.currPage - 1
        if(prevPage < 1) break
        this.getTopics(prevPage)
        break
      case '1':
      case '2':
      case '3':
      case '4':
        this.getTopics(Number(action))
        break
      case '>':
        const nextPage = this.currPage + 1
        if(nextPage > 4) break
        this.getTopics(nextPage)
        break
      case '>>':
        this.getTopics(lastPage)
        break
      default:
        break
    }
  }

}