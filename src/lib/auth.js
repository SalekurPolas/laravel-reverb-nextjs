import axios from 'axios';

export async function loginWithPhone(phone) {
  const password = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/token`;

  const params = {
    type: 'phone',
    country_code: '+88',
    username: phone,
    password,
  };

  const res = await axios.get(url, {
    headers: { Accept: 'application/json' },
    params,
  });

  const { token, user } = res.data;
  return { token, user };
}
