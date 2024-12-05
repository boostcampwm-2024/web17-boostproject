self.addEventListener('push', (event) => {
  const data = event.data
    ? event.data.json()
    : { title: '알림', body: '내용 없음' };

  self.registration.showNotification(data.title, {
    body: data.body,
    // icon: 'icon.png',
  });
});
