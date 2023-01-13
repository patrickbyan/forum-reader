import { Injectable } from "@angular/core"
import * as moment from 'moment';
import { Topics } from "src/types/topic";

interface LatestData {
    1: Array<Topics>,
    2: Array<Topics>,
    3: Array<Topics>,
    4: Array<Topics>,
}

interface Store {
    latestId: number,
    latestData: LatestData
}

@Injectable({ providedIn: 'root' })
export class TopicService {
    private store: Store = {
        latestId: 0,
        latestData: {
            1: [],
            2: [],
            3: [],
            4: []
        }
    }

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

    private removeStore() {
        this.store = {
            latestId: 0,
            latestData: {
                1: [],
                2: [],
                3: [],
                4: []
            }
        }
    }

    private createStore (id: number, page: number, payload: Array<Topics> = []) {
        this.store = {
            latestId: id,
            latestData: {
                ...this.store.latestData,
                [page]: payload
            }
        }
    }
    
    async getTopics(page = 1, size = 5) {
        const offset = (page - 1) * size

        const fetchTopicIds = await this.get('/askstories.json')
        
        if(fetchTopicIds.err) {
            this.removeStore()
            return [] 
        }

        const firstId = fetchTopicIds.data[0]

        if(firstId === this.store.latestId) {
            const { latestData } = this.store
            

            if(latestData[page as keyof LatestData].length) {
                return latestData[page as keyof LatestData]
            }
        }

        const topicIds = fetchTopicIds.data.splice(offset, size)

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
            this.removeStore()
            return []
        }

        this.createStore(firstId, page, topics)

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

        fetchTopic.data.duration = this.getTimeDiff(time)


        return fetchTopic.data
    }
}