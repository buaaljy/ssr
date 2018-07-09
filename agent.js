module.exports = agent => {

  const timeout = {};

  agent.messenger.on('before_render', (data) => {
    console.log('before_render', data.uuid);
    timeout[data.uuid] = setTimeout(() => {
      console.log('need to kill app');
      // graceful 和 egg-cluster
    }, 3000);
  });

  agent.messenger.on('after_render', (data) => {
    console.log('after_render', data.uuid);
    clearTimeout(timeout[data.uuid]);
  });
};