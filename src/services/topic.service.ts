import { Injectable } from "@angular/core"
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class TopicService {
    private API_URL = 'https://hacker-news.firebaseio.com/v0'
    private async get (url: string) {
        try {
            const data = await fetch(this.API_URL + url)
            .then((response) => response.json())
            .catch((err) => {
                throw err
            })

            return {
                err: false,
                data
            }
        } catch (error) {
            return {
                err: true,
            }    
        }
    }

    private getTimeDiff (time: number) {
        const timestamp = moment.unix(time)
        
        return timestamp.fromNow()
    }
    
    async getTopics() {
        const fetchTopicIds = await this.get('/askstories.json')
        
        if(fetchTopicIds.err) {
           return [] 
        }

        const topicIds = fetchTopicIds.data.filter((id: number, index: number) => index < 20)
        
        let error = false
        const topics = await Promise.all(
            topicIds.map(async (id: number) => {
                const fetchTopic = await this.get(`/item/${id}.json`)
                if(fetchTopic.err) {
                    error = true
                    return
                }

                const { time } = fetchTopic.data

                fetchTopic.data.duration = this.getTimeDiff(time)

                return fetchTopic.data
            })
        )

        if(error) {
            return []
        }

        return topics
    }

    async getDiscussions(id: number) {
        const fetchTopic = await this.get(`/item/${id}.json`)
        if(fetchTopic.err) {
            return []
        }
        
        
        
        if(fetchTopic.data?.kids?.length) {
            const [kidId] = fetchTopic.data.kids

            const fetchKids = await this.get(`/item/${kidId}.json`)
            if(fetchKids.err) {
                return []
            }


            const { time } = fetchKids.data

            fetchKids.data.duration = this.getTimeDiff(time)
            fetchTopic.data.comments = fetchKids.data
        }


        const { time } = fetchTopic.data

        console.log(this.getTimeDiff(time))
        fetchTopic.data.duration = this.getTimeDiff(time)


        return fetchTopic.data
    }
}