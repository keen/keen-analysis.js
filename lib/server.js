import Keen from './keen'
import Request from './request'
import * as httpHandlers from './utils/http-server'

Request.httpHandlers = httpHandlers
Keen.Request = Request

export default Keen
