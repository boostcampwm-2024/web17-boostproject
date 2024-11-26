const fn = async () => {
  console.log('before');
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log('after');
};

fn();
