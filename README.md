# Event monitoring application

### Install

1.  Install node https://nodejs.org/en/, node 8 is required
2.  Install yarn globally `npm i -g yarn`
3.  Install packages `yarn`

## Launch

1.  Run app `yarn start`
2.  Endpoint avaiable at `http://localhost:3000`

### Tests

1.  Run `yarn test`

### API

`PUT /data` Event ingestion

```ts
interface Event {
  sensorId: int;
  time: int;
  value?: float;
}
```

`GET /data?[sensorId=int][since=int][until=int]` Event querying

`GET POST PUT DELETE /thresholds` Event threshold values crud,
notification will be sent to the threshold address in case of threshold overflow upon event ingestion

```ts
interface Threshold {
  sensorId: int;
  value: float;
  notificationType: "email" | "sms";
  email?: string;
  phone?: string;
}
```
