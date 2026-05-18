# app.py

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/sort", methods=["POST"])
def sort_array():

    data = request.get_json()

    arr = data.get("array", [])
    algorithm = data.get("algorithm", "bubble")

    if not arr or len(arr) < 2:
        return jsonify({"error": "Need at least 2 numbers"}), 400

    arr_copy = arr[:]

    algorithms = {
        "bubble": bubble_sort_steps,
        "selection": selection_sort_steps,
        "insertion": insertion_sort_steps,
        "merge": merge_sort_steps,
        "quick": quick_sort_steps,
        "heap": heap_sort_steps,
        "counting": counting_sort_steps
    }

    if algorithm not in algorithms:
        return jsonify({"error": "Unknown algorithm"}), 400

    steps = algorithms[algorithm](arr_copy)

    final = sorted(arr)

    stats = {
        "min": min(arr),
        "max": max(arr),
        "sum": sum(arr),
        "avg": round(sum(arr) / len(arr), 1)
    }

    return jsonify({
        "steps": steps,
        "sorted": final,
        "stats": stats
    })


# ─────────────────────────────────────────────────────────────
# Bubble Sort
# ─────────────────────────────────────────────────────────────

def bubble_sort_steps(arr):

    steps = []
    n = len(arr)

    for i in range(n):

        for j in range(n - i - 1):

            steps.append({
                "action": "compare",
                "indices": [j, j + 1],
                "array": arr[:],
                "sorted": list(range(n - i, n)),
                "pseudoLine": 1
            })

            if arr[j] > arr[j + 1]:

                arr[j], arr[j + 1] = arr[j + 1], arr[j]

                steps.append({
                    "action": "swap",
                    "indices": [j, j + 1],
                    "array": arr[:],
                    "sorted": list(range(n - i, n)),
                    "pseudoLine": 3
                })

    steps.append({
        "action": "done",
        "array": arr[:],
        "sorted": list(range(n)),
        "pseudoLine": -1
    })

    return steps


# ─────────────────────────────────────────────────────────────
# Selection Sort
# ─────────────────────────────────────────────────────────────

def selection_sort_steps(arr):

    steps = []
    n = len(arr)

    sorted_idx = []

    for i in range(n):

        min_idx = i

        steps.append({
            "action": "select-min",
            "indices": [min_idx],
            "array": arr[:],
            "sorted": sorted_idx[:],
            "pseudoLine": 0
        })

        for j in range(i + 1, n):

            steps.append({
                "action": "compare",
                "indices": [min_idx, j],
                "array": arr[:],
                "sorted": sorted_idx[:],
                "pseudoLine": 1
            })

            if arr[j] < arr[min_idx]:

                min_idx = j

                steps.append({
                    "action": "select-min",
                    "indices": [min_idx],
                    "array": arr[:],
                    "sorted": sorted_idx[:],
                    "pseudoLine": 1
                })

        arr[i], arr[min_idx] = arr[min_idx], arr[i]

        sorted_idx.append(i)

        steps.append({
            "action": "swap",
            "indices": [i, min_idx],
            "array": arr[:],
            "sorted": sorted_idx[:],
            "pseudoLine": 2
        })

    steps.append({
        "action": "done",
        "array": arr[:],
        "sorted": list(range(n)),
        "pseudoLine": -1
    })

    return steps


# ─────────────────────────────────────────────────────────────
# Insertion Sort
# ─────────────────────────────────────────────────────────────

def insertion_sort_steps(arr):

    steps = []
    n = len(arr)

    for i in range(1, n):

        key = arr[i]
        j = i - 1

        while j >= 0 and arr[j] > key:

            steps.append({
                "action": "compare",
                "indices": [j, j + 1],
                "array": arr[:],
                "sorted": list(range(i)),
                "pseudoLine": 2
            })

            arr[j + 1] = arr[j]

            steps.append({
                "action": "shift",
                "indices": [j, j + 1],
                "array": arr[:],
                "sorted": list(range(i)),
                "pseudoLine": 2
            })

            j -= 1

        arr[j + 1] = key

        steps.append({
            "action": "insert",
            "indices": [j + 1],
            "array": arr[:],
            "sorted": list(range(i + 1)),
            "pseudoLine": 3
        })

    steps.append({
        "action": "done",
        "array": arr[:],
        "sorted": list(range(n)),
        "pseudoLine": -1
    })

    return steps


# ─────────────────────────────────────────────────────────────
# Merge Sort
# ─────────────────────────────────────────────────────────────

def merge_sort_steps(arr):

    steps = []

    def merge(left, mid, right):

        left_part = arr[left:mid + 1]
        right_part = arr[mid + 1:right + 1]

        i = 0
        j = 0
        k = left

        steps.append({
            "action": "divide",
            "range": [left, right],
            "array": arr[:],
            "pseudoLine": 0
        })

        while i < len(left_part) and j < len(right_part):

            steps.append({
                "action": "compare",
                "indices": [left + i, mid + 1 + j],
                "array": arr[:],
                "pseudoLine": 2
            })

            if left_part[i] <= right_part[j]:

                arr[k] = left_part[i]
                i += 1

            else:

                arr[k] = right_part[j]
                j += 1

            steps.append({
                "action": "merge",
                "indices": [k],
                "array": arr[:],
                "pseudoLine": 3
            })

            k += 1

        while i < len(left_part):

            arr[k] = left_part[i]

            steps.append({
                "action": "merge",
                "indices": [k],
                "array": arr[:],
                "pseudoLine": 3
            })

            i += 1
            k += 1

        while j < len(right_part):

            arr[k] = right_part[j]

            steps.append({
                "action": "merge",
                "indices": [k],
                "array": arr[:],
                "pseudoLine": 3
            })

            j += 1
            k += 1

    def merge_sort(left, right):

        if left >= right:
            return

        mid = (left + right) // 2

        merge_sort(left, mid)
        merge_sort(mid + 1, right)

        merge(left, mid, right)

    merge_sort(0, len(arr) - 1)

    steps.append({
        "action": "done",
        "array": arr[:],
        "sorted": list(range(len(arr))),
        "pseudoLine": -1
    })

    return steps


# ─────────────────────────────────────────────────────────────
# Quick Sort
# ─────────────────────────────────────────────────────────────

def quick_sort_steps(arr):

    steps = []

    def partition(low, high):

        pivot = arr[high]

        steps.append({
            "action": "pivot",
            "indices": [high],
            "array": arr[:],
            "pseudoLine": 0
        })

        i = low - 1

        for j in range(low, high):

            steps.append({
                "action": "compare",
                "indices": [j, high],
                "array": arr[:],
                "pseudoLine": 1
            })

            if arr[j] < pivot:

                i += 1

                arr[i], arr[j] = arr[j], arr[i]

                steps.append({
                    "action": "partition",
                    "indices": [i, j],
                    "array": arr[:],
                    "pseudoLine": 2
                })

        arr[i + 1], arr[high] = arr[high], arr[i + 1]

        steps.append({
            "action": "swap",
            "indices": [i + 1, high],
            "array": arr[:],
            "pseudoLine": 3
        })

        return i + 1

    def quick_sort(low, high):

        if low < high:

            pi = partition(low, high)

            quick_sort(low, pi - 1)
            quick_sort(pi + 1, high)

    quick_sort(0, len(arr) - 1)

    steps.append({
        "action": "done",
        "array": arr[:],
        "sorted": list(range(len(arr))),
        "pseudoLine": -1
    })

    return steps


# ─────────────────────────────────────────────────────────────
# Heap Sort
# ─────────────────────────────────────────────────────────────

def heap_sort_steps(arr):

    steps = []
    n = len(arr)

    def heapify(size, root):

        largest = root

        left = 2 * root + 1
        right = 2 * root + 2

        if left < size:

            steps.append({
                "action": "heapify",
                "indices": [root, left],
                "array": arr[:],
                "sorted": list(range(size, n)),
                "pseudoLine": 1
            })

            if arr[left] > arr[largest]:
                largest = left

        if right < size:

            steps.append({
                "action": "heapify",
                "indices": [largest, right],
                "array": arr[:],
                "sorted": list(range(size, n)),
                "pseudoLine": 1
            })

            if arr[right] > arr[largest]:
                largest = right

        if largest != root:

            arr[root], arr[largest] = arr[largest], arr[root]

            steps.append({
                "action": "root-swap",
                "indices": [root, largest],
                "array": arr[:],
                "sorted": list(range(size, n)),
                "pseudoLine": 2
            })

            heapify(size, largest)

    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)

    for i in range(n - 1, 0, -1):

        arr[0], arr[i] = arr[i], arr[0]

        steps.append({
            "action": "root-swap",
            "indices": [0, i],
            "array": arr[:],
            "sorted": list(range(i, n)),
            "pseudoLine": 3
        })

        heapify(i, 0)

    steps.append({
        "action": "done",
        "array": arr[:],
        "sorted": list(range(n)),
        "pseudoLine": -1
    })

    return steps


# ─────────────────────────────────────────────────────────────
# Counting Sort
# ─────────────────────────────────────────────────────────────

def counting_sort_steps(arr):

    steps = []

    max_val = max(arr)
    min_val = min(arr)

    range_size = max_val - min_val + 1

    count = [0] * range_size
    output = [0] * len(arr)

    for i, num in enumerate(arr):

        count[num - min_val] += 1

        steps.append({
            "action": "count",
            "value": num,
            "countArray": count[:],
            "array": arr[:],
            "pseudoLine": 0
        })

    for i in range(1, len(count)):
        count[i] += count[i - 1]

    for i in range(len(arr) - 1, -1, -1):

        current = arr[i]

        output[count[current - min_val] - 1] = current

        count[current - min_val] -= 1

        steps.append({
            "action": "place",
            "value": current,
            "output": output[:],
            "array": output[:],
            "pseudoLine": 2
        })

    arr[:] = output[:]

    steps.append({
        "action": "done",
        "array": arr[:],
        "sorted": list(range(len(arr))),
        "pseudoLine": -1
    })

    return steps


if __name__ == "__main__":
    app.run(debug=True)