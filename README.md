# MobilePlatformsProjectJS
JS version
Project created for Mobile Platforms workshops.
Do zaliczenia zadania wymagane jest napisanie programu, który posiada następujące cechy:

#### 1.Dwie strony (Page). Na głównej stronie „Średnie kursy walut” należy zaprojektować następujące panele:

##### a.panel wyświetlający w czytelnie sformatowanej tabelce nazwę waluty oraz jej kurs na bieżący dzień; Po kliknięciu na wybraną walutę z tabelki sterowanie programu powinno zostać przekazane do następnej strony zatytułowanej „Historia kursu ???”, gdzie ??? oznacza symbol wybranej waluty – szczegóły patrz punkt 3 niniejszej specyfikacji;

##### b.panel (np. obok po lewej) wyświetlający listę dat opublikowanych plików z innych dni; Po wybraniu dowolnej pozycji z w/w listy zawartość panelu z punktu (a) powinna zostać zmodyfikowana o dane odczytane z tabeli z NBP dla wybranej daty;

##### c.pasek aplikacji na górze zawierający przynajmniej ikonę do wyjścia z programu; Mile widziane inne opcje;

#### 2.Na drugiej stronie „Historia waluty ???” należyzaprojektować następujące elementy interfejsu użytkownika oraz ich funkcjonalności:

##### a.kontrolki umożliwiające szybkie i łatwe ustalenie daty początkowej oraz końcowej wyświetlania historii kursu danej   waluty (uwaga: należy zabronić ustawienia daty starszej niż tej, dla której opublikowano dane dot. walut w serwisie NBP);

##### b.element graficzny rysujący wykres przebiegu kursu danej waluty (w tym np. etykiety osi, legenda, siatka itp.) w przedziale czasowym określonym przez w/w kontrolki;

##### c.pasek postępu wczytywania nowych danych z NBP oraz zapisywanie lokalnie już raz pobranych danych,

##### d.możliwość zapisania wykresu do pliku np. JPG z opcją wskazania katalogu docelowego (zaimplementowane np. w postaci dolnego paska aplikacji i odpowiedniego przycisku);

##### e.mile   widziane   jest   zaimplementowanie   gestu   powrotu   do   poprzedniej   strony   poprzez   przesunięcie palcem/myszką w kierunku prawym;

##### f.pasek aplikacji zawierający przynajmniej przyciski powrotu do poprzedniej strony oraz wyjścia z aplikacji;

#### 3.Aplikacja   powinna   mieć   zaimplementowany   mechanizm   przywracania   stanu   aplikacji   i   nawigacji   obiektu   Frame oraz przechowywać dane użytkownika tj.:

##### a.ostatnio otwartą stronę aplikacji;

##### b.w przypadku strony pierwszej - datę, dla której ostatnio były wyświetlane kursy walut w tabelce (punkt 2a) (chyba, że data nie istnieje już w archiwum NBP, i wtedy wyświetlić tabelę dla daty starszej);

##### c.dla strony historii waluty ostatnio przeglądaną walutę wraz z ustawionymi datami początkową i końcową; 
