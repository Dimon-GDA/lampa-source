import Notice from '../notice'
import NoticeClass from './class'
import DB from '../../utils/db'

class NoticeLampa extends NoticeClass {
    constructor(params){
        super(params)

        this.name = 'Lampa'
        this.time = 0
        this.view = 0

        this.notices = []

        this.connect()
    }

    connect(){
        this.db = new DB('notice', ['all','readed'], 2)
        this.db.openDatabase().then(this.update.bind(this))
    }

    update(){
        this.db.getData('readed','time').then((time)=>{
            this.time = time || 0

            return this.db.getData('all')
        }).then(result=>{
            result.sort((a,b)=>{
                return a.time > b.time ? -1 : a.time < b.time ? 1 : 0
            })

            this.notices = result

            this.view = result.filter(n=>n.time > this.time).length

            Notice.drawCount()
        }).catch(e=>{})
    }

    count(){
        return this.view
    }

    push(element, resolve, reject){
        if(!(element.id && element.from)) return reject('No (id) or (from)')

        if(!this.notices.find(n=>n.id == element.id)){
            this.db.addData('all', element.id, element).then(this.update.bind(this)).then(resolve).catch(reject)
        }
        else reject('Already added')
    }

    viewed(){
        this.db[this.time == 0 ? 'addData' : 'updateData']('readed','time',Date.now())

        this.view = 0
        this.time = Date.now()

        Notice.drawCount()
    }

    items(){
        return this.notices
    }
}


export default NoticeLampa