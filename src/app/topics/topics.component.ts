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
  
  constructor(private topicService: TopicService) { }

  ngOnInit(): void {
    this.topicService.getTopics()
    .then((response) => {
      this.topics = response
    })
  }
}