import bunyan from "bunyan"
import { GetNotifications, ListNotificationsByCustomer } from "./services/notifications";

const logger = bunyan.createLogger({
  name: "appsync",
})

interface HandlerEvent {
  identity: any
  arguments: any
  field: string
}

export const handler = (event: HandlerEvent) => {

  logger.info(event)
  logger.info(`event.field: `)
  logger.info(event.field)

  switch (event.field) {
    case "getNotification":
      return GetNotifications(event.arguments)
    case "listNotificationByCustomer":
      return ListNotificationsByCustomer(event.arguments)
    case "saveNotification":
      return event
    default:
      return Promise.reject(`unknown operation: ${event.field}`)
  }
}

