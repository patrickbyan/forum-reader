import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TopicService } from '../../services/topic.service';
import { Topics } from '../../types/topic';

@Component({
  selector: 'topic-discussion',
  templateUrl: './topic-discussion.component.html',
  styleUrls: ['./topic-discussion.component.css']
})
export class TopicDiscussionComponent implements OnInit {
  discussion: Topics = {
    by: '',
    id: 0,
    text: '',
    time: 0,
    title: '',
    type: '',
    comments: {
        id: 0,
        text: '',
        title: '',
        type: '',
        time: 0,
        by: ''
    },
  }

  constructor(
    private service: TopicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const params = {
        id: null
    }

    this.route.paramMap.forEach((param) => Object.assign(params, { id: param.get('id') }))
    
    if(params.id) {
        this.service.getDiscussions(params.id)
        .then((response) => {
            this.discussion = response
        })
    }
  }

  goToTopics() {
    this.router.navigate(['/topics']);
  }
}