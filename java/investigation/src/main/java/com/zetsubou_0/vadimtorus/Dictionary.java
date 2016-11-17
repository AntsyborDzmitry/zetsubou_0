package com.zetsubou_0.vadimtorus;

import java.util.*;

public class Dictionary<K, V> extends HashMap<K, V> {

    public static void main(String[] args) {
        Map<String, String> map = new Dictionary<>();
        map.put("1", "10");
        map.put("2", "20");
        map.put("3", "30");
        map.put("4", "40");

        Iterator<Entry<String, String>> entryIterator = map.entrySet().iterator();
        while (entryIterator.hasNext()) {
            Entry<String, String> entry = entryIterator.next();
            System.out.println(entry.getKey() + " " + entry.getValue());
        }
    }

    public Dictionary() {
    }

    @Override
    public Set<Entry<K, V>> entrySet() {
        return new DictionarySet(super.entrySet());
    }

    private Iterator<Entry<K, V>> getOriginIterator() {
        return super.entrySet().iterator();
    }

    private class DictionaryIterator implements Iterator<Entry<K, V>> {

        private Iterator<Entry<K, V>> iterator;

        public DictionaryIterator() {
            iterator = Dictionary.this.getOriginIterator();
        }

        @Override
        public boolean hasNext() {
            return iterator.hasNext() && iterator.hasNext();
        }

        @Override
        public Entry<K, V> next() {
            Entry<K, V> entry = iterator.next();
            return entry == null ? null : iterator.next();
        }
    }

    private class DictionarySet implements Set<Entry<K, V>> {

        final Set<Entry<K, V>> set;

        public DictionarySet(final Set<Entry<K, V>> set) {
            this.set = set;
        }

        @Override
        public int size() {
            return set.size();
        }

        @Override
        public boolean isEmpty() {
            return set.isEmpty();
        }

        @Override
        public boolean contains(final Object o) {
            return set.contains(o);
        }

        @Override
        public Iterator<Entry<K, V>> iterator() {
            return new DictionaryIterator();
        }

        @Override
        public Object[] toArray() {
            return set.toArray();
        }

        @Override
        public <T> T[] toArray(final T[] ts) {
            return set.toArray(ts);
        }

        @Override
        public boolean add(final Entry<K, V> kvEntry) {
            return set.add(kvEntry);
        }

        @Override
        public boolean remove(final Object o) {
            return set.remove(o);
        }

        @Override
        public boolean containsAll(final Collection<?> collection) {
            return set.containsAll(collection);
        }

        @Override
        public boolean addAll(final Collection<? extends Entry<K, V>> collection) {
            return set.addAll(collection);
        }

        @Override
        public boolean retainAll(final Collection<?> collection) {
            return set.retainAll(collection);
        }

        @Override
        public boolean removeAll(final Collection<?> collection) {
            return set.removeAll(collection);
        }

        @Override
        public void clear() {
            set.clear();
        }
    }
}
