from agent.synth import dedupe_by_url

def test_dedupe():
    docs = [{"url":"a","text":"x"},{"url":"a","text":"y"},{"url":"b","text":"z"}]
    out = dedupe_by_url(docs)
    assert len(out)==2
