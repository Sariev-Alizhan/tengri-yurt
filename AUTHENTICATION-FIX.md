# Исправление проблемы с авторизацией

## Проблема
При входе через поставщика происходит редирект на `/supplier/register`, хотя данные есть в базе.

**Причина**: Бесконечная рекурсия в RLS политиках Supabase.

Ошибка:
```
infinite recursion detected in policy for relation "profiles"
```

Политика "Admins can read all profiles" проверяла роль через таблицу `profiles`, что создавало циклическую зависимость.

## Решение

### Шаг 1: Применить SQL миграцию в Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **SQL Editor**
4. Скопируйте содержимое файла `supabase/fix-rls-recursion.sql`
5. Вставьте в SQL Editor и нажмите **Run**

Этот скрипт:
- Удалит старые RLS политики с рекурсией
- Создаст новые политики, использующие `auth.jwt()` вместо `profiles` таблицы

### Шаг 2: Обновить существующих пользователей

Для существующих пользователей нужно установить роль в `user_metadata`:

```sql
-- Запустите в SQL Editor Supabase
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"supplier"'
)
WHERE id IN (
  SELECT user_id FROM suppliers
);
```

### Шаг 3: Перелогиниться

После применения миграции:
1. Выйдите из системы (Sign Out)
2. Войдите снова через `/supplier/login`
3. Теперь должен работать доступ к dashboard

## Что было исправлено

### 1. RLS Политики
**Было**:
```sql
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
```

**Стало**:
```sql
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
```

### 2. API регистрации поставщика
Теперь при регистрации обновляется не только таблица `profiles`, но и `user_metadata` в `auth.users`:

```typescript
await supabase.auth.admin.updateUserById(
  userId,
  { user_metadata: { role: 'supplier' } }
);
```

### 3. Задержка перед редиректом
Добавлена небольшая задержка (500ms) после регистрации, чтобы дать Supabase время обработать изменения.

## Проверка

После применения исправлений проверьте:

1. ✅ Вход через `/supplier/login` работает
2. ✅ Редирект на `/supplier/dashboard` происходит корректно
3. ✅ Данные поставщика отображаются на dashboard
4. ✅ Нет ошибок в консоли браузера и терминале

## Дополнительная информация

### Как работает авторизация сейчас

1. **Вход**: POST `/api/auth/login` → `supabase.auth.signInWithPassword()`
2. **Сессия**: Cookies с access/refresh токенами (7 дней)
3. **Middleware**: Обновляет сессию на каждом запросе
4. **Dashboard**: Проверяет `user` и `supplier` запись
5. **RLS**: Использует `auth.jwt()` для проверки роли

### Структура данных

- `auth.users` - встроенная таблица Supabase Auth
  - `raw_user_meta_data.role` - роль пользователя (для JWT)
- `profiles` - расширенная информация о пользователе
  - `role` - дублирование роли для удобства запросов
- `suppliers` - информация о поставщике
  - `user_id` - ссылка на `profiles.id`
  - `is_approved` - статус модерации

### Полезные команды

Проверить роль пользователя в JWT:
```sql
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as jwt_role
FROM auth.users
WHERE email = 'your@email.com';
```

Проверить запись поставщика:
```sql
SELECT 
  s.*,
  p.role as profile_role
FROM suppliers s
JOIN profiles p ON p.id = s.user_id
WHERE s.user_id = 'user-uuid-here';
```
