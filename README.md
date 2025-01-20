# Vardar Eğitim Uygulaması

## Kurulum

1. Projeyi klonlayın

```bash
git clone https://github.com/your-username/vardar-egitim-app.git
cd vardar-egitim-app
```

2. Bağımlılıkları yükleyin

```bash
npm install
```

3. Environment dosyasını oluşturun

- `src/environments/environment.example.ts` dosyasını `src/environments/environment.ts` olarak kopyalayın
- Supabase bilgilerinizi ekleyin:
  ```typescript
  export const environment = {
    production: false,
    supabaseUrl: "YOUR_SUPABASE_URL",
    supabaseKey: "YOUR_SUPABASE_KEY",
  };
  ```

4. Uygulamayı başlatın

```bash
ng serve
```

## Deployment

1. Production environment dosyasını oluşturun

- `src/environments/environment.example.ts` dosyasını `src/environments/environment.production.ts` olarak kopyalayın
- Production Supabase bilgilerinizi ekleyin

2. Build alın

```bash
ng build --configuration production
```

3. Firebase'e deploy edin

```bash
firebase deploy
```

## Güvenlik Notları

- Environment dosyaları (`.env`, `environment.ts`, `environment.production.ts`) asla GitHub'a push edilmemelidir
- Bu dosyalar hassas bilgiler içerdiği için `.gitignore` dosyasına eklenmiştir
- Yeni bir geliştirici projeyi kurduğunda kendi environment dosyalarını oluşturmalıdır

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
