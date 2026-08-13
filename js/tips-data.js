// ===================================================================
// TIPS DATA — single source of truth, shared by tips.js and tip-detail.js
// Seeds localStorage on first visit; both pages read from the same key.
// ===================================================================

const TIPS_STORAGE_KEY = 'portfolio_tips';

function getDefaultTips() {
    return [
        {
            id: 'immutability-prevents-bugs',
            category: 'Best Practices',
            date: '2026-07-27',
            readTime: '3 min read',
            title: 'Immutability Prevents Bugs',
            excerpt: 'Mutating data in-place causes subtle bugs, especially in React. Always return new objects and arrays instead of modifying the originals.',
            insight: 'Return new objects and arrays instead of modifying the originals — mutation is where subtle bugs hide.',
            codeBeforeLabel: 'Mutating State (Risky)',
            codeBefore: `function addItem(cart, item) {
  cart.items.push(item);
  return cart;
}`,
            codeAfterLabel: 'Immutable Update (Safe)',
            codeAfter: `function addItem(cart, item) {
  return {
    ...cart,
    items: [...cart.items, item]
  };
}`,
            whyMatters: 'When you mutate an object directly, anything else holding a reference to it changes too — including old React state, which breaks re-renders and creates bugs that are hard to trace back to their source.',
            principles: [
                'Never mutate props or state directly',
                'Prefer spread syntax over push/splice',
                'Treat data as read-only by default'
            ],
            quoteAuthor: 'Software design principle',
            quote: 'Shared mutable state is the root of most hard-to-find bugs.'
        },
        {
            id: 'early-return-pattern',
            category: 'Clean Code',
            date: '2026-07-27',
            readTime: '2 min read',
            title: 'Early Return Pattern',
            excerpt: 'Return early from functions to avoid deep nesting. Each guard clause reduces indentation and makes the happy path clear.',
            insight: 'Each guard clause you add removes one layer of nesting and makes the happy path easier to follow.',
            codeBeforeLabel: 'Deeply Nested (Hard to Read)',
            codeBefore: `function process(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        doWork(user);
      }
    }
  }
}`,
            codeAfterLabel: 'Early Returns (Clean)',
            codeAfter: `function process(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  doWork(user);
}`,
            whyMatters: 'Deep nesting forces the reader to hold several conditions in their head at once. Guard clauses handle the exceptions up front, so the rest of the function reads as the one thing it actually does.',
            principles: [
                'Handle edge cases first, then the main logic',
                'Keep function bodies as flat as possible',
                'One guard clause per invalid condition'
            ],
            quoteAuthor: 'Clean code principle',
            quote: 'Code is read far more often than it is written — optimize for the reader.'
        },
        {
            id: 'intersection-observer-lazy-loading',
            category: 'Frontend',
            date: '2026-07-27',
            readTime: '4 min read',
            title: 'Intersection Observer: Efficient Lazy Loading',
            excerpt: 'Stop using scroll listeners for lazy loading. Intersection Observer is browser-native, asynchronous, and significantly more efficient.',
            insight: 'Intersection Observer runs off the main thread, so it detects visibility without the jank of scroll-event listeners.',
            codeBeforeLabel: 'Scroll Listener (Expensive)',
            codeBefore: `window.addEventListener('scroll', () => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    loadImage(el);
  }
});`,
            codeAfterLabel: 'Intersection Observer (Efficient)',
            codeAfter: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) loadImage(entry.target);
  });
});
observer.observe(el);`,
            whyMatters: 'Scroll listeners fire dozens of times per second and force layout recalculations. Intersection Observer is asynchronous and only fires when visibility actually changes, so the main thread stays free.',
            principles: [
                'Avoid scroll/resize listeners for visibility checks',
                'Let the browser tell you when elements enter view',
                'Disconnect observers once elements are handled'
            ],
            quoteAuthor: 'Performance principle',
            quote: 'The fastest code is the code that never has to run.'
        },
        {
            id: 'dsa-big-o-memory',
            category: 'DSA',
            date: '2026-05-12',
            readTime: '3 min read',
            title: 'DSA: Big O Memory Complexity',
            excerpt: "Don't just optimize for speed; optimize for memory. Avoid creating large intermediate arrays when a single pass or a generator will suffice.",
            insight: 'Space complexity matters as much as time complexity — an O(n) time solution that allocates O(n) extra memory isn\u2019t always the best option.',
            codeBeforeLabel: 'Extra Array Allocated',
            codeBefore: `function squareAll(nums) {
  const squared = nums.map(n => n * n);
  return squared.reduce((a, b) => a + b, 0);
}`,
            codeAfterLabel: 'Single Pass, No Extra Array',
            codeAfter: `function squareAll(nums) {
  let sum = 0;
  for (const n of nums) sum += n * n;
  return sum;
}`,
            whyMatters: 'Creating an intermediate array doubles your memory footprint for no benefit when you only need the final result. On large datasets, this difference decides whether your code scales or crashes.',
            principles: [
                'Ask "do I need this array, or just its result?"',
                'Prefer single-pass loops over chained array methods when memory is tight',
                'Track both time and space complexity, not just one'
            ],
            quoteAuthor: 'DSA principle',
            quote: 'An efficient algorithm respects both the clock and the memory.'
        },
        {
            id: 'oop-liskov-substitution',
            category: 'OOP',
            date: '2026-05-12',
            readTime: '3 min read',
            title: "OOP: The Liskov Substitution Principle",
            excerpt: "Ensure that subclasses can stand in for their parent classes without breaking the app. This is the 'L' in SOLID.",
            insight: 'A subclass should be usable anywhere its parent class is expected, without the caller needing to know the difference.',
            codeBeforeLabel: 'Violates LSP',
            codeBefore: `class Bird {
  fly() { return 'flying'; }
}
class Penguin extends Bird {
  fly() { throw new Error('Penguins cannot fly'); }
}`,
            codeAfterLabel: 'Respects LSP',
            codeAfter: `class Bird {}
class FlyingBird extends Bird {
  fly() { return 'flying'; }
}
class Penguin extends Bird {}`,
            whyMatters: 'When a subclass breaks a promise the parent class made, every piece of code that trusted the parent type can fail unexpectedly. Fixing the hierarchy up front avoids scattering special-case checks everywhere.',
            principles: [
                'Subclasses must honor the parent\u2019s contract',
                'Don\u2019t force a subclass to override with an error',
                'Model "is-a" relationships that hold in every case'
            ],
            quoteAuthor: 'SOLID principle',
            quote: 'If it looks like a duck but needs batteries, you probably have the wrong abstraction.'
        },
        {
            id: 'python-decorators',
            category: 'Languages',
            date: '2026-05-12',
            readTime: '3 min read',
            title: 'Languages: Python Decorators',
            excerpt: 'Use decorators to wrap functions with additional logic (like logging or timing) without modifying their original code.',
            insight: 'A decorator wraps a function to add behavior — logging, timing, caching — without touching the function\u2019s own code.',
            codeBeforeLabel: 'Logic Mixed In',
            codeBefore: `def process(data):
    start = time.time()
    result = transform(data)
    print(time.time() - start)
    return result`,
            codeAfterLabel: 'Separated via Decorator',
            codeAfter: `def timed(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(time.time() - start)
        return result
    return wrapper

@timed
def process(data):
    return transform(data)`,
            whyMatters: 'Mixing cross-cutting concerns like timing or logging into business logic makes both harder to change independently. A decorator keeps the core function focused on one job.',
            principles: [
                'Keep cross-cutting concerns out of core logic',
                'Reuse the same decorator across many functions',
                'Prefer composition over repeating boilerplate'
            ],
            quoteAuthor: 'Python idiom',
            quote: 'A decorator changes what a function does without changing what it says.'
        },
        {
            id: 'wordpress-custom-post-types',
            category: 'WordPress Tips',
            date: '2026-06-10',
            readTime: '3 min read',
            title: 'Custom Post Types Over Generic Posts',
            excerpt: "Stop cramming everything into 'Posts'. Custom Post Types keep content structured and make custom fields far easier to manage.",
            insight: 'A dedicated post type keeps content structured and makes custom fields and templates far easier to manage than jamming everything into standard Posts.',
            codeBeforeLabel: 'Using Default Posts',
            codeBefore: `$post_id = wp_insert_post([
  'post_title' => $title,
  'post_type'  => 'post'
]);`,
            codeAfterLabel: 'Custom Post Type',
            codeAfter: `function register_project_cpt() {
  register_post_type('project', [
    'label' => 'Projects',
    'public' => true,
    'supports' => ['title', 'editor', 'thumbnail']
  ]);
}
add_action('init', 'register_project_cpt');`,
            whyMatters: 'Custom Post Types separate content models cleanly, so templates, custom fields, and queries stay predictable as the site grows, instead of filtering regular posts by hidden meta values.',
            principles: [
                'Use a CPT whenever content has its own fields or structure',
                "Register CPTs on WordPress's init hook",
                'Pair CPTs with custom taxonomies for filtering'
            ],
            quoteAuthor: 'WordPress development principle',
            quote: 'Structure your content model before you write a single template.'
        },
        {
            id: 'react-key-prop',
            category: 'React',
            date: '2026-06-18',
            readTime: '3 min read',
            title: "Keys Aren't Just for Silencing Warnings",
            excerpt: 'A stable, unique key tells React which item changed, was added, or removed. Using array index as key can cause real bugs, not just console warnings.',
            insight: 'React uses the key prop to match list items across renders — the wrong key can cause state to leak between components.',
            codeBeforeLabel: 'Index as Key (Risky)',
            codeBefore: `{items.map((item, index) => (
  <TodoItem key={index} data={item} />
))}`,
            codeAfterLabel: 'Stable ID as Key (Safe)',
            codeAfter: `{items.map((item) => (
  <TodoItem key={item.id} data={item} />
))}`,
            whyMatters: 'When list order changes and the key is just the index, React matches the wrong component to the wrong data — local state like an open input can silently carry over to the wrong row.',
            principles: [
                'Never use array index as key when the list can reorder',
                'Use a stable, unique ID from your data instead',
                'Keys only need to be unique among sibling elements'
            ],
            quoteAuthor: 'React principle',
            quote: 'Keys tell React which items are which across renders.'
        },
        {
            id: 'modern-js-optional-chaining',
            category: 'Modern JS',
            date: '2026-06-25',
            readTime: '2 min read',
            title: 'Optional Chaining Over Nested Checks',
            excerpt: 'Optional chaining (?.) and nullish coalescing (??) replace long chains of && checks, making deeply nested data access safe and readable.',
            insight: 'Optional chaining stops at the first null or undefined instead of throwing, replacing long chains of manual guard checks.',
            codeBeforeLabel: 'Manual Guards',
            codeBefore: `const city = user && user.address && user.address.city
  ? user.address.city
  : 'Unknown';`,
            codeAfterLabel: 'Optional Chaining + Nullish Coalescing',
            codeAfter: `const city = user?.address?.city ?? 'Unknown';`,
            whyMatters: 'Manual guard chains grow with nesting depth and hide the actual intent of the code. Optional chaining expresses "access this safely" in one readable line.',
            principles: [
                'Use ?. when a value in the chain might not exist',
                "Use ?? for defaults instead of || , which also catches 0 and ''",
                "Don't overuse ?. to hide bugs that should actually throw"
            ],
            quoteAuthor: 'Modern JS principle',
            quote: 'Optional chaining should express intent, not mask bad data.'
        },
        {
            id: 'database-indexing-basics',
            category: 'Database',
            date: '2026-04-14',
            readTime: '3 min read',
            title: 'Indexes Speed Reads, Slow Writes',
            excerpt: 'An index on the right column turns a slow table scan into a fast lookup — but every index also adds overhead to every insert and update.',
            insight: 'An index trades faster reads for slower writes, since the database must update the index on every insert, update, or delete.',
            codeBeforeLabel: 'No Index',
            codeBefore: `SELECT * FROM orders WHERE customer_id = 4521;
-- full table scan on large tables`,
            codeAfterLabel: 'Indexed Column',
            codeAfter: `CREATE INDEX idx_orders_customer_id
ON orders (customer_id);`,
            whyMatters: 'Without an index, the database checks every row to find matches. On a table with millions of rows, that difference is the gap between milliseconds and seconds.',
            principles: [
                'Index columns used often in WHERE, JOIN, or ORDER BY',
                "Don't index every column — writes get slower",
                'Measure with EXPLAIN before adding a new index'
            ],
            quoteAuthor: 'Database design principle',
            quote: "An index you don't query is pure overhead."
        },
        {
            id: 'algorithms-two-pointer',
            category: 'Algorithms',
            date: '2026-03-20',
            readTime: '4 min read',
            title: 'The Two-Pointer Technique',
            excerpt: 'Many array problems that look like they need nested loops can be solved in a single pass with two pointers moving toward each other.',
            insight: 'Two pointers moving from opposite ends of a sorted array can often replace a nested loop, dropping O(n\u00b2) down to O(n).',
            codeBeforeLabel: 'Nested Loop O(n\u00b2)',
            codeBefore: `function hasPairSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return true;
    }
  }
  return false;
}`,
            codeAfterLabel: 'Two Pointers O(n)',
            codeAfter: `function hasPairSum(sortedNums, target) {
  let left = 0, right = sortedNums.length - 1;
  while (left < right) {
    const sum = sortedNums[left] + sortedNums[right];
    if (sum === target) return true;
    sum < target ? left++ : right--;
  }
  return false;
}`,
            whyMatters: 'Recognizing that a sorted array lets you eliminate half the remaining possibilities each step is the difference between a quadratic and a linear solution.',
            principles: [
                "Sort first if the problem doesn't depend on original order",
                "Move the pointer that can't possibly reach the target",
                'Works well for pair-sum, palindrome, and partition problems'
            ],
            quoteAuthor: 'Algorithms principle',
            quote: 'A sorted array is a hint, not just a side detail.'
        },
        {
            id: 'data-structures-hashmap-lookup',
            category: 'Data Structures',
            date: '2026-03-05',
            readTime: '3 min read',
            title: 'Reach for a Hash Map Before a Nested Loop',
            excerpt: "If you're searching an array inside a loop, a hash map often turns O(n\u00b2) lookups into O(n) by trading a bit of memory for speed.",
            insight: 'A hash map turns "have I seen this value before" into an O(1) lookup instead of scanning the array again.',
            codeBeforeLabel: 'Nested Search',
            codeBefore: `function firstDuplicate(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return nums[i];
    }
  }
  return null;
}`,
            codeAfterLabel: 'Hash Map Lookup',
            codeAfter: `function firstDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
  return null;
}`,
            whyMatters: "Every time you find yourself searching an array from inside another loop, ask if a Set or Map could remember what you've already seen — it usually can.",
            principles: [
                'Use a Set for "have I seen this before" checks',
                'Use a Map when you need to store a value alongside the key',
                'Hash lookups cost a bit of memory for a lot of speed'
            ],
            quoteAuthor: 'Data structures principle',
            quote: 'Trade memory for speed when the loop is the bottleneck.'
        },
        {
            id: 'architecture-separate-concerns',
            category: 'Architecture',
            date: '2026-02-18',
            readTime: '4 min read',
            title: "Separate What Changes From What Doesn't",
            excerpt: "Good architecture isn't about frameworks — it's about isolating the parts of your system likely to change from the parts that should stay stable.",
            insight: "Group code by what tends to change together, not by technical layer alone — business rules shouldn't know about your database driver.",
            codeBeforeLabel: 'Tightly Coupled',
            codeBefore: `function createOrder(data) {
  const conn = new MySQLConnection();
  conn.query('INSERT INTO orders ...', data);
}`,
            codeAfterLabel: 'Separated via Interface',
            codeAfter: `function createOrder(data, orderRepository) {
  orderRepository.save(data);
}
// MySQLOrderRepository implements save()`,
            whyMatters: 'When business logic directly depends on a specific database or framework, changing either one means rewriting the logic too. An interface boundary lets you swap the implementation without touching the rules.',
            principles: [
                'Keep business rules independent of frameworks and databases',
                'Depend on interfaces, not concrete implementations',
                "Ask: what would break if I swapped this piece out?"
            ],
            quoteAuthor: 'Software architecture principle',
            quote: 'The database is a detail — the business rules are the point.'
        },
        {
            id: 'software-engineering-tech-debt',
            category: 'Software Engineering',
            date: '2026-02-02',
            readTime: '3 min read',
            title: 'Not All Technical Debt Is a Mistake',
            excerpt: 'Sometimes shipping the quick version on purpose is the right call — as long as you track it and plan to pay it back.',
            insight: 'Deliberate technical debt, taken on knowingly and tracked, is a tool. Debt you never noticed you were taking on is the dangerous kind.',
            codeBeforeLabel: 'Untracked Shortcut',
            codeBefore: `// TODO fix this later (never gets fixed)
function calculateTotal(items) {
  return items.reduce((a, b) => a + b.price, 0);
  // ignores discounts for now
}`,
            codeAfterLabel: 'Tracked Shortcut',
            codeAfter: `// KNOWN LIMITATION (ticket #482): discounts not yet applied
// Revisit before the Q3 promotions launch
function calculateTotal(items) {
  return items.reduce((a, b) => a + b.price, 0);
}`,
            whyMatters: "A shortcut that's written down and ticketed gets revisited. A silent TODO comment gets forgotten until it causes a production bug.",
            principles: [
                'Decide consciously when to take on debt, not by accident',
                'Track shortcuts with a ticket, not just a comment',
                'Revisit debt before it compounds into a rewrite'
            ],
            quoteAuthor: 'Software engineering principle',
            quote: 'Debt you can see is manageable; debt you forgot about is a landmine.'
        },
        {
            id: 'it-operations-rollback-plan',
            category: 'IT Operations',
            date: '2026-01-22',
            readTime: '3 min read',
            title: 'Every Deploy Needs a Rollback Plan',
            excerpt: 'Before you ship, know exactly how you\u2019d undo it. A deploy without a rollback plan turns a bug into an incident.',
            insight: 'The question is not just "how do I deploy this" — it\u2019s "how fast can I undo this if it breaks something."',
            codeBeforeLabel: 'No Rollback Plan',
            codeBefore: `# Deploy and hope for the best
git push production main`,
            codeAfterLabel: 'Deploy With a Rollback Path',
            codeAfter: `# Tag the last known-good release first
git tag pre-deploy-2026-07-27
git push production main
# Rollback if needed:
# git push production pre-deploy-2026-07-27:main --force`,
            whyMatters: 'Incidents get worse the longer they take to resolve. A tagged known-good state turns a broken deploy into a two-minute fix instead of a war room.',
            principles: [
                'Tag or snapshot the last stable state before every deploy',
                'Practice the rollback command before you need it under pressure',
                "Monitor right after deploy — don't wait for user reports"
            ],
            quoteAuthor: 'IT operations principle',
            quote: 'Hope is not a rollback strategy.'
        },
        {
            id: 'technical-insight-premature-optimization',
            category: 'Technical Insight',
            date: '2026-01-08',
            readTime: '3 min read',
            title: 'Measure Before You Optimize',
            excerpt: 'Most performance work targets the wrong line of code because it\u2019s based on a guess, not a profiler. Measure first, then optimize the actual bottleneck.',
            insight: 'The part of the code that feels slow is rarely the part that actually is — a profiler finds the real bottleneck, intuition usually does not.',
            codeBeforeLabel: 'Optimizing by Guess',
            codeBefore: `// "this loop looks slow, let me rewrite it"
for (const item of largeList) {
  process(item);
}`,
            codeAfterLabel: 'Optimizing After Measuring',
            codeAfter: `console.time('process');
for (const item of largeList) {
  process(item);
}
console.timeEnd('process');
// profiler shows the real bottleneck is process(), not the loop`,
            whyMatters: 'Rewriting code that was never actually slow wastes time and adds complexity for no benefit, while the real bottleneck stays untouched.',
            principles: [
                'Profile before you optimize, not after you guess',
                'Optimize the bottleneck that actually shows up in the numbers',
                'Readable code beats clever code that saves microseconds'
            ],
            quoteAuthor: 'Donald Knuth (paraphrased)',
            quote: 'Premature optimization wastes far more engineering time than it saves.'
        },
        {
            id: 'engineering-wisdom-simple-first',
            category: 'Engineering Wisdom',
            date: '2025-12-15',
            readTime: '2 min read',
            title: 'Make It Work, Then Make It Right',
            excerpt: 'The simplest solution that solves the problem today is usually the right first draft — you can always add complexity later, but removing it is much harder.',
            insight: "It's far easier to add complexity to something simple that works than to simplify something complex that barely does.",
            codeBeforeLabel: 'Over-Engineered First Draft',
            codeBefore: `class NotificationFactoryProviderStrategy {
  // built for 10 notification types, project only needs 2
}`,
            codeAfterLabel: 'Simple First Draft',
            codeAfter: `function sendNotification(type, message) {
  if (type === 'email') return sendEmail(message);
  if (type === 'sms') return sendSMS(message);
}`,
            whyMatters: 'Building for imagined future requirements adds real cost today for a benefit that may never arrive. Start simple, and let actual new requirements justify added complexity.',
            principles: [
                "Solve today's actual requirement, not tomorrow's guess",
                'Add abstraction when a second real use case appears, not before',
                'Simple code is easier to delete and replace than complex code'
            ],
            quoteAuthor: 'Engineering wisdom',
            quote: "You aren't going to need it, until you actually do."
        },
        {
            id: 'python-list-comprehension',
            category: 'Python',
            date: '2025-11-30',
            readTime: '2 min read',
            title: 'List Comprehensions Over Manual Loops',
            excerpt: 'A list comprehension often replaces four lines of manual looping and appending with one readable line — and it\u2019s usually faster too.',
            insight: 'A list comprehension expresses "build a new list from this one" in a single line instead of a loop with manual appends.',
            codeBeforeLabel: 'Manual Loop',
            codeBefore: `squares = []
for n in numbers:
    if n % 2 == 0:
        squares.append(n * n)`,
            codeAfterLabel: 'List Comprehension',
            codeAfter: `squares = [n * n for n in numbers if n % 2 == 0]`,
            whyMatters: 'Comprehensions read like the English description of the transformation, and Python optimizes them internally, so they are usually faster than the equivalent manual loop.',
            principles: [
                'Use a comprehension when building a new list from an existing one',
                'Keep comprehensions to one clear transformation — split up nested ones',
                'Fall back to a loop if the comprehension gets hard to read'
            ],
            quoteAuthor: 'Python idiom',
            quote: "Readable code is Pythonic code, even when it's short."
        }
    ];
}

function ensureTipsSeeded() {
    const existing = localStorage.getItem(TIPS_STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(getDefaultTips()));
    }
}

function getTips() {
    ensureTipsSeeded();
    return JSON.parse(localStorage.getItem(TIPS_STORAGE_KEY)) || [];
}

function getTipById(id) {
    return getTips().find(t => t.id === id) || null;
}
