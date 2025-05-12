import { NextResponse } from 'next/server';

// Функция для проверки аутентификации
export default function middleware(req) {
  const { pathname } = req.nextUrl;

  // Применяем только к маршрутам администратора
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('auth');

    // Нет токена, перенаправляем на страницу входа
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // С токеном продолжаем выполнение, а валидацию будет делать компонент AdminLayout
    return NextResponse.next();
  }

  // Для всех других маршрутов просто пропускаем
  return NextResponse.next();
}

// Определяем пути, для которых будет запускаться middleware
export const config = {
  matcher: ['/admin/:path*']
}; 